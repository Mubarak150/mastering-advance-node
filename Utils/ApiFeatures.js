class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query; 
        this.queryStr = queryStr; 
    }
    
    filter () {
        let queryObj = {...this.queryStr};

        // 1. delete all the keys in req.query (this.queryStr here and onwards) which matches with the exclude array... 
        const excludeFields = ['sort', 'page', 'limit', 'fields']; 
        excludeFields.map(el => delete queryObj[el]);

         // 2. now add $ to gte etc if present, using regex
         let queryString = JSON.stringify(queryObj); 
         queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); 
         let reqQuery = JSON.parse(queryString);
 
         // 3. using the filtered and formatted req.query in mongoose: 
         this.query = this.query.find(reqQuery)

         // Return `this` to allow chaining
        return this;
    }

    sort () {
        // 4. sorting:
        if(this.queryStr.sort) {
            let sortBy = this.queryStr.sort.split(',').join(' '); 
            this.query = this.query.sort(sortBy); 
        } else {
            this.query = this.query.sort('-createdAt'); 
        }

        return this; 
    }

    limit_fields () {
        // 5. limiting fields: this is called PROJECTION [inclusive or exclusive] in mongodb
        if(this.queryStr.fields){
            let fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v'); // return all except version in default...
        }

        return this; 
    }

     paginate () {
        const page = this.queryStr.page*1 || 1; // by multiplying it with 1 i am changing its type from str to num. 
        const limit = this.queryStr.limit*1 || 20; 

        this.query = this.query.skip((page - 1)*limit).limit(limit);

        // if(this.queryStr.page){
        //     const moviesCount = await Movie.countDocuments();
        //     if((page - 1)*limit >= moviesCount) {
        //         throw new Error('this page does not exists'); 
        //     }
        // }

        return this; 
    }

}

module.exports = ApiFeatures; 