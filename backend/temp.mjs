import { client } from "@gradio/client";

async function predict(data) {
  try{
  const app = await client("LilPanda/CardiacGradingSystem-SNN");
//const app = await client("http://8.147.232.181:7860");
  const result = await app.predict("/predict", [
    data,
  ]);
  // console.log(result.data);
  return {url:result.data[0].url, label:result.data[1].label};
}catch{
  return null;
}
}

export {predict}
