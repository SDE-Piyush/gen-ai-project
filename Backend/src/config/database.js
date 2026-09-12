const mongoose= require("mongoose")


async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database")
    } catch (error) {
        console.log("DB connection failed:", error.message)
    }
}

module.exports = connectToDB