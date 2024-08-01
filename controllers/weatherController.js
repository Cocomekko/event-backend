const WEATHER_API_KEY = process.env.WEATHER_API_KEY; 

const getWeather = async (req, res) => {
  const { location } = req.params;

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getWeather
};


