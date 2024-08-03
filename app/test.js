// user visit => /auth/google aftet that he will redirect to google authentication page
app.get('/auth/google', (req, res) => {
    const queryParams = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      access_type: 'offline',
      prompt: 'consent',
    });
    res.redirect(`${googleAuthUrl}?${queryParams}`);
  });



//   after google user authentication
// google will send a request for path /auth/google/callback with code as a query param this code enables you to get the user access token
// from that access token use can gain user data
// http://localhost:3000/api/auth/google/callback
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const response = await axios.post(googleTokenUrl, null, {
        params: {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code'
        },
      });
      const { id_token,access_token } = response.data;
  
      const userInfoResponse = await axios.get(googleUserInfoUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      const { id, name, email, picture } = userInfoResponse.data;
      
      // Find or create the user in the database
    //   let user = await User.findOne({ where: { googleId: id } });
    //   if (!user) {
    //     user = await User.create({ googleId: id, name, email, picture });
    //   }
  
    //   req.session.user = user;
    //   res.redirect('/profile');
    // => register
    // -check if the user email exist
    } catch (error) {
      console.error('Error during OAuth callback', error);
      res.redirect('/error');
    }
  });