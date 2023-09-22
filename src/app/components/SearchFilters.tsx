import * as React from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";


export enum EntityType {
  MEMBER = "actor.member",
  COLLECTION = "collection.collection",
  ARTICLE = "curation.article",
  AUDIO = "curation.audio",
  BOOK = "curation.book",
  HIGHLIGHT = "contribution.highlight",
  IMAGE = "curation.image",
  TEXT = "curation.text",
  TWEET = "curation.tweet",
  VIDEO = "curation.video",
  LINK = "curation.link",
  FILE = "curation.file",
}

export interface SearchFiltersProps {
  handleSelect: (event: any) => void;
  filters: EntityType[];
}

export default function SearchFilters(props: SearchFiltersProps) {

  return (
    <Box sx={{ display: "flex" }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Choose Filter</FormLabel>
        <FormGroup>
          {Object.values(EntityType).map((entity) => (
            <FormControlLabel
              key={entity}
              control={
                <Checkbox
                  checked={props.filters.includes(entity)}
                  onChange={props.handleSelect}
                  name={entity}
                />
              }
              label={entity}
            />
          ))}
        </FormGroup>
        <FormHelperText>Please avoid me to translate entity types 🙃</FormHelperText>
      </FormControl>
    </Box>
  );
}
