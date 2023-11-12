import { v2 as cloudUpload } from "cloudinary"

cloudUpload.config({
    cloud_name: "",
    api_key: "",
    api_secret: ""
})

export { cloudUpload }
