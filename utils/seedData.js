const axios = require("axios");
const fetchData = async (url, category, model) => {
  const res = await axios.get(url);
  const data = res.data.results.filter( (obj) => obj.overview !== "").map(obj=>({TMDB_id: obj.id, backdropUrl:`https://image.tmdb.org/t/p/w500${obj.backdrop_path}`, posterUrl:`https://image.tmdb.org/t/p/w500${obj.poster_path}`, title:  obj.title || obj.name, description:obj.overview, trailerUrl: "", 
  category:category}));
  console.log(data.length);
  model.insertMany(data);
}

const fetchTrailers= async(url) => {
  try {
      const res = await axios.get(url);
      const results = res.data.results;
      if(results && results.length > 0){
        const trailer = results.find(video => video.type === 'Trailer');
        // console.log(trailer.key);
        if (trailer) {
          // Get the first trailer (assuming there is one)
          const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
          return Promise.resolve(trailerUrl);
        }
      }else{
        return Promise.resolve("");
      }
    }catch (error) {
    // console.error('Error fetching trailer:', error);
    return Promise.resolve("");
  }
}

const seedData = (model) => { 
    const currentYear = new Date().getFullYear();
    const movieUrl = `${process.env.TMDB_MOVIE_URL}?api_key=${process.env.TMDB_API_KEY}&${process.env.TMDB_MOVIE_QUERY_KEY}=${currentYear}`;
    const tvUrl = `${process.env.TMDB_TV_URL}?api_key=${process.env.TMDB_API_KEY}&${process.env.TMDB_TV_QUERY_KEY}=${currentYear}`;
    fetchData(movieUrl,"Movie", model);
    fetchData(tvUrl, "TV", model);
 }
  
//  fetchTrailers(`https://api.themoviedb.org/3/tv/106379/videos?api_key=${process.env.TMDB_API_KEY}`).then((result) => { console.log(result); });

// const test = async () => { 
//   const result = await fetchTrailers(`https://api.themoviedb.org/3/tv/106379/videos?api_key=${process.env.TMDB_API_KEY}`);
//   console.log("result", result);
//  }

//  test();



module.exports = {
    seedData
}