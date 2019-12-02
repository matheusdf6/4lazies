enum ActionResult {
    OK = "ok",
    ERROR = "error",
    NOTSET = "null"
}

type Tuple = [ ActionResult , any ];
const getStatus = (tuple : Tuple) => tuple[0];
const getData = (tuple: Tuple) => tuple[1];
const getMessage = (tuple: Tuple) =>{ return { status: getStatus(tuple), data: getData(tuple) } }

export { ActionResult, getMessage, Tuple };