"use client";

import {
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { JsonViewer } from "@textea/json-viewer";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import SearchFilters, { EntityType } from "./components/SearchFilters";
import styles from "./page.module.css";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [openTokensModal, setOpenTokensModal] = useState(false);
  const [fieldToken, setFieldToken] = useState(null);
  const [filters, setFilters] = useState<EntityType[]>([]);

  useEffect(() => {
    let controller = new AbortController();
    let signal = controller.signal;

    if (filters.length > 0 || searchTerm != "") {
      setLoading(true);
      const filterParams = filters
        .map((filter) => `entity_type=${filter}`)
        .join("&");

      let url  = `${process.env.NEXT_PUBLIC_SUBLIME_HOST}/api/v2/feed/search/?${filterParams}`
      if (searchTerm) url = url + `&search=${searchTerm}`

      fetch(
        url,
        { signal }
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data.results);
          setLoading(false);
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            console.log(error);
          }
        });

      return () => {
        controller.abort();
      };
    }
  }, [filters, searchTerm]);

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    if (checked) {
      setFilters([...filters, name as EntityType]);
    } else {
      setFilters(filters.filter((entity) => entity !== name));
    }
  };

  return (
    <main className={styles.main}>
      <Container fixed>
        <Box sx={{ display: "flex" }}>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Buscar</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              startAdornment={
                <InputAdornment position="start">&#707;</InputAdornment>
              }
              label="Amount"
            />
          </FormControl>
        </Box>
        <Dialog
          open={openTokensModal}
          onClose={() => setOpenTokensModal(false)}
          scroll="body"
          maxWidth="md"
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
        <Grid container>
          <Grid item xs={3}>
            <SearchFilters handleSelect={handleSelect} filters={filters} />
          </Grid>
          <Grid item xs={9}>
            {isLoading ? <p>Loading...</p> : <></>}
            {!data ? <p>No data...</p> : <></>}
            {!isLoading &&
              data &&
              data.map((result: any) => (
                <div key={result.uuid}>
                  <Grid container m={2} spacing={2}>
                    <Grid item xs={10}>
                      <Box
                        onClick={() => {
                          setOpenTokensModal(true);
                          setFieldToken(result.tokens["name"]);
                        }}
                      >
                        <Typography variant="h6">{result.name}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <Box
                        onClick={() => {
                          setOpenTokensModal(true);
                          setFieldToken(JSON.parse(result.explanation));
                        }}
                      >
                        <Typography variant="body1" align="right">
                          {Number.parseFloat(result.score).toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9}>
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <Typography variant="caption">
                          <Box sx={{ textTransform: "lowercase" }}>
                            {result.tagline}
                          </Box>
                        </Typography>
                        <Box mx={1}></Box>
                        <Typography variant="caption">by</Typography>
                        <Box mx={1}></Box>
                        <Box
                          onClick={() => {
                            setOpenTokensModal(true);
                            setFieldToken(result.tokens["authors"]);
                          }}
                        >
                          <Typography variant="caption">
                            {result.authors.join(" ")}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={9}>
                      <Box
                        onClick={() => {
                          setOpenTokensModal(true);
                          setFieldToken(result.tokens["urls"]);
                        }}
                      >
                        <Typography>{result.urls}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9}>
                      <Box
                        onClick={() => {
                          setOpenTokensModal(true);
                          setFieldToken(result.tokens["description"]);
                        }}
                      >
                        {result.embed.html ? (
                          <div
                            className="embed-tweet"
                            dangerouslySetInnerHTML={{
                              __html: result.embed.html,
                            }}
                          />
                        ) : (
                          <Typography variant="body2">
                            {result.description ? result.description : null}
                            {result.about ? result.about : null}
                            {result.bio ? result.bio : null}
                            {result.html ? result.html : null}
                            {result.text ? result.text : null}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="caption">
                        {result.curated_by["first"] &&
                          result.curated_by["first"]["name"]}{" "}
                        (1st) and {result.curated_by["others"]} others connected
                      </Typography>
                    </Grid>
                  </Grid>
                  <hr />
                </div>
              ))}
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
