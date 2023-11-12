import { app } from "./app"
import { PORT } from "./lib/constants"

app.listen(PORT, () => {
  console.log(`TIMSAN API BACKEND - Running on PORT : ${PORT}`)
})
