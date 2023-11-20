import { app } from "./app"
import { PORT } from "./lib/constants"
import { mailTransporter } from "./lib/mail"

app.listen(PORT, () => {
  mailTransporter.verify((error, success) => {
    if (error) {
      console.log("error sending email now... ", error)
    } else {
      console.log("can now send emails... ", success)
    }
  })
  console.log(`TIMSAN API BACKEND - Running on PORT : ${PORT}`)
})
