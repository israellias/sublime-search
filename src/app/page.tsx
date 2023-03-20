"use client";

import { Box, Container, Dialog, DialogContent, DialogContentText, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { JsonViewer } from '@textea/json-viewer';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import styles from './page.module.css';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [openTokensModal, setOpenTokensModal] = useState(false);
  const [fieldToken, setFieldToken] = useState(null);


  const handleSearch = async (event: any) => {
    if (event.key === 'Enter' && searchTerm !== '') {
      setLoading(true)
      fetch(`http://localhost:8000/api/v2/feed/search/?search=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data.results)
          setLoading(false)
        })
    }
  }

  return (
    <main className={styles.main}>
      <Container>
        <Box sx={{ display: 'flex' }}>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Buscar</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={handleSearch}
              startAdornment={<InputAdornment position="start">&#707;</InputAdornment>}
              label="Amount"
            />
          </FormControl>
        </Box>
        <Box>
          <Dialog
            open={openTokensModal}
            onClose={() => setOpenTokensModal(false)}
            scroll='body'
            maxWidth='md'
            fullWidth
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <DialogContent dividers={false}>
              <DialogContentText>
                <div>
                  <JsonViewer value={fieldToken} />
                </div>
              </DialogContentText>
            </DialogContent>
          </Dialog>
          {isLoading ? <p>Loading...</p> : <></>}
          {!data ? <p>No data...</p> : <></>}
          {!isLoading && data &&
            data.map((result: any) => (
              <>
                <Grid container m={2} spacing={2} key={result.uuid} >
                  <Grid item xs={10}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Box onClick={() => {
                        setOpenTokensModal(true);
                        setFieldToken(result.tokens['name'])
                      }}>
                        <Typography variant='h6'>{result.name}</Typography>
                      </Box>
                      <Box mx={2}></Box>
                      <Typography variant='caption'><Box sx={{ textTransform: 'lowercase' }}>
                        {result.tagline}</Box></Typography>

                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box onClick={() => {
                      setOpenTokensModal(true);
                      setFieldToken(JSON.parse(result.explanation));
                    }}>
                      <Typography variant='body1' align='right'>{Number.parseFloat(result.score).toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box onClick={() => {
                      setOpenTokensModal(true);
                      setFieldToken(result.tokens['urls']);

                    }}>
                      <Typography>{result.urls}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box onClick={() => {
                      setOpenTokensModal(true);
                      setFieldToken(result.tokens['description']);
                    }}>
                      <Typography variant='caption'>
                        {result.description ? result.description : null}
                        {result.about ? result.about : null}
                        {result.bio ? result.bio : null}
                        {result.html ? result.html : null}
                        {result.text ? result.text : null}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <hr />
              </>
            ))
          }
        </Box>
      </Container>
    </main>
  )
}
