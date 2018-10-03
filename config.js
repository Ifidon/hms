module.exports = {
	config: function() {
		if (process.env.NODE_ENV == 'production') {
			MONGO_URI =  'mongodb://e_fidon:truand11ape@cluster0-shard-00-00-3rkmw.mongodb.net:27017,cluster0-shard-00-01-3rkmw.mongodb.net:27017,cluster0-shard-00-02-3rkmw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
		}
		else {
			MONGO_URI = 'mongodb://localhost:27017/hms'
		}

		return MONGO_URI
	}
}