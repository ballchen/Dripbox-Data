exports.Version = {
  id: String,
  checkSum: String, // (Hash the file using MD5)
  author: String, // (user's id)
  uploaded: {
    type: Boolean,
    default: false
  },
  createdAt: Date,
  updatedAt: Date
}
