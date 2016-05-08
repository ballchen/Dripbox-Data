exports.Node = {
  id: String,
  name: String,
  publicLevel: Number,
  collaborator: Array,
  author: String, // userId
  type: String, // dir or file
  link: String,
  currentVersion: String, // version id
  shortLink: String,
  originId: String, 
  deleted: {
    type: Boolean,
    default: false
  },
  createdAt: Date,
  updatedAt: Date
}