import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Container from '@mui/material/Container';
import { Grid, Card, CardContent, Typography, CardMedia, CircularProgress } from '@mui/material';

function table() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/searchBooks?title='); // Replace with your API endpoint
        setBooks(response.data.books);
        setLoading(false);
      } catch (error) {
        setError('Failed to load books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={'http://localhost:3000/images/'+book.imgName} // Assuming book has an imageUrl field
                  alt={book.title}
                />
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {book.description}
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    ${book.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export default table