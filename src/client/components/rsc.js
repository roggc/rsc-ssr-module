import React, { useMemo, Suspense } from "react";
import { fillJSXWithClientComponents, parseJSX } from "../utils/index.js";
import { usePropsChangedKey } from "../hooks/use-props-changed-key.js";
import useSWR from "swr";

const Error = ({ errorMessage }) => <>Something went wrong: {errorMessage}</>;

const fetcher = (componentName, body) =>
  fetch(`/${componentName}`, {
    method: "post",
    headers: { "content-type": "application/json" },
    body,
  })
    .then((response) => response.text())
    .then((clientJSXString) => {
      const clientJSX = JSON.parse(clientJSXString, parseJSX);
      return fillJSXWithClientComponents(clientJSX);
    })
    .catch((error) => {
      return <Error errorMessage={error.message} />;
    });

const getReader = () => {
  let done = false;
  let promise = null;
  let value;
  return {
    read: (fetcher) => {
      if (done) {
        return value;
      }
      if (promise) {
        throw promise;
      }
      promise = new Promise(async (resolve) => {
        try {
          value = await fetcher();
        } catch (e) {
          value = errorJSX;
        } finally {
          done = true;
          promise = null;
          resolve();
        }
      });

      throw promise;
    },
  };
};

const Read = ({ fetcher, reader }) => {
  return reader.read(fetcher);
};

const ReadSWR = ({ swrArgs, fetcher }) => {
  return useSWR(swrArgs, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    suspense: true,
  }).data;
};

export function RSC({
  componentName = "__no_component_name__",
  children = <>loading ...</>,
  softKey,
  isSWR = false,
  ...props
}) {
  const propsChangedKey = usePropsChangedKey(...Object.values(props));
  const body = useMemo(() => {
    return JSON.stringify({ props });
  }, [propsChangedKey]);

  const reader = useMemo(() => getReader(), [propsChangedKey, softKey]);

  const fetcherSWR = ([, componentName, body]) => fetcher(componentName, body);
  const swrArgs = useMemo(
    () => [softKey, componentName, body],
    [componentName, body, softKey]
  );

  return (
    <Suspense fallback={children}>
      {isSWR ? (
        <ReadSWR swrArgs={swrArgs} fetcher={fetcherSWR} />
      ) : (
        <Read fetcher={() => fetcher(componentName, body)} reader={reader} />
      )}
    </Suspense>
  );
}
