module.exports = {
	check: function (array, item) {
    	for (i in array) {
        	if(array._id === item._id) {
        		return true
        	}
        	else {
        		return false
        	}
   		}
	},

	consultlimit: function(array) {
		var today = new Date();
	    var day  = today.getDate();
	    var nextday = day + 1
	    var month = today.getMonth()+1;
	    var year = today.getFullYear();
	    var date = year + '-' + month + '-' + day;
	    var nextday = year + '-' + month + '-' + nextday;

	    for (i in array) {
	      if ((new Date(date) <= array[i].createdAt) && (array[i].createdAt < new Date(nextday))) {
	        return true
	      }
	      else {
	        return false
	      }
	    }
	},

	opts: {
	service: 'gmail',
	auth: {
		user: 'neftilsngl@gmail.com',
		pass: 'neft@gmail'
	}
}
};
