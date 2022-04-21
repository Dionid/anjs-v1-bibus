import path from "path";

import { DockerComposeEnvironment, Wait } from "testcontainers";

jest.setTimeout(100000);

export const setupCH = async () => {
  const composeFilePath = path.resolve(__dirname);
  const composeFile = "docker-compose.yaml";

  console.log("BEFORE DockerComposeEnvironment");

  const environment = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile
  )
    .withWaitStrategy(
      "zookeeper_1",
      Wait.forLogMessage("binding to port /0.0.0.0:2181")
    )
    .withWaitStrategy(
      "clickhouse01_1",
      Wait.forLogMessage("Application: Listening for http://0.0.0.0:8123")
    )
    .up();

  console.log("BEFORE getContainer");
  const chContainer = environment.getContainer("clickhouse01_1");
  console.log("BEFORE uri");
  const uri = `http://${chContainer.getHost()}:${chContainer.getMappedPort(
    8123
  )}`;
  console.log(uri);

  return {
    env: environment,
    uri,
  };
};

// export const setupCHClient = async () => {
//   const { env, uri } = await setupCHEvn();
//
//   return {
//     client: CHClient({
//       uri,
//     }),
//     env,
//   };
// };
