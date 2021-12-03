// Base - Model.find({})
// BigQ - Query string
// BigQ -> search=coder&page=2&catagory=hoodies&rating[gte]=4&price[lte]=999&price[lte]=199&limit=5

class WhereClause {
    constructor(base, BigQ) {
        this.base = base;
        this.BigQ = BigQ;
    }
    // search for a shirt
    search() {
        // if there is a search term in this object, then
        const searchWord = this.BigQ.search ? {
            // if we find search keyword in url query
            name: {
                $regex: this.BigQ.search,
                $options: 'i'
            }
        }: {}
        // User.find({}) = User.find({}).find({search : tshirt-name});
        this.base = this.base.find({...searchWord}); 
        return this;    
    }
    fileter() {
        // Real Object is not modified we make a soft copy of that object 
        const copyQ = {...this.BigQ};
        // deleting the unnecessary fields which is not having any gte or lte fields
        delete copyQ["search"];
        delete copyQ["page"];    
        delete copyQ["limit"];    
        delete copyQ["catagory"];    
        
        // convert BigQ into string
        let StringOfCopyQ = JSON.stringify(copyQ);
        /*
            This will replace all gte or lte in the priceing or rating to $gte or $lte so we can find with mongodb
        */ 
        StringOfCopyQ.replace(/\bgte|lte|gt|lt\b/g,m=> `$${m}`);
        const jsonOfCopyQ = JSON.parse(StringOfCopyQ);
        
        this.base = this.base.find(jsonOfCopyQ);
        return this;
        
    }   
    pager(resultPerPage) {
      let currPage = 1;
      if (this.BigQ.page) {
        currPage = this.BigQ.page;
      }
      // https://mongoosejs.com/docs/api/query.html#query_Query-limit
      // The limit is a :- Specifies the maximum number of documents the query will return.
      
      // formula for pager
      const skipVal = resultPerPage * (currPage - 1);
      // Product.find({}) = Product.find({}).limit(resultPerPage).skip(skipVal)
      this.base = this.base.limit(resultPerPage).skip(skipVal);
      return this;
    }
    length () {
        return this.count;
    }
};

module.exports = WhereClause;