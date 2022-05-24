import { useMapStore } from '@hyperobjekt/mapgl';
import { Box, Modal, Typography, Button, IconButton } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import React, { useState } from 'react';
import shallow from 'zustand/shallow';
import Autosuggest from 'react-autosuggest';
import { MAPBOX_TOKEN, FULL_FUNCT_ZOOM_THRESHOLD, FLY_TO_ZOOM } from 'App/shared/constants';
import { useSearchStore } from '../../store';
import { Container, InputWrapper, Content } from './SearchModal.styles';

const SearchModal = () => {
  const [modalOpened, setModalOpened, recentLocations, setRecentLocations] = useSearchStore(
    (state) => [
      state.modalOpened,
      state.setModalOpened,
      state.recentLocations,
      state.setRecentLocations,
    ],
    shallow,
  );
  const [viewport, flyToBounds, flyTo] = useMapStore((state) => [
    state.viewState,
    state.flyToBounds,
    state.flyTo,
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');

  const handleClose = () => {
    setModalOpened(false);
  };

  const handleClear = () => {
    setValue('');
    setSuggestions([]);
  };

  const getSuggestions = (value) => {
    const inputValue = encodeURIComponent(value);

    // If not a very long string, just return empty array.
    if (inputValue.length < 3) {
      return setSuggestions([]);
    } else {
      // Construct query path.
      const path =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputValue}.json?` +
        `access_token=${MAPBOX_TOKEN}&cachebuster=${Math.floor(
          Date.now(),
        )}&autocomplete=true&country=US${
          viewport?.zoom > FULL_FUNCT_ZOOM_THRESHOLD
            ? `&proximity=${viewport.longitude},${viewport.latitude}`
            : ``
        }`;
      // Get request for autosuggest results.
      fetch(path)
        .then((r) => r.json())
        .then((json) => {
          setSuggestions(json.features);
        });
    }
  };

  const handleSelection = (e, suggestion) => {
    if (!!suggestion.suggestion.bbox) {
      flyToBounds([
        [suggestion.suggestion.bbox[0], suggestion.suggestion.bbox[1]],
        [suggestion.suggestion.bbox[2], suggestion.suggestion.bbox[3]],
      ]);
    } else {
      flyTo({
        latitude: suggestion.suggestion.center[1],
        longitude: suggestion.suggestion.center[0],
        zoom: FLY_TO_ZOOM,
      });
    }
    setRecentLocations(recentLocations.length < 5 ? [...recentLocations, suggestion] : []);
    setModalOpened(false);
    handleClear();
  };

  const handleFetchRequested = ({ value }) => {
    getSuggestions(value);
  };

  const handleClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => {
    return suggestion.place_name;
  };

  const renderSuggestion = (suggestion) => {
    return (
      <div id={suggestion.id} key={suggestion.id}>
        {suggestion.place_name}
      </div>
    );
  };

  const inputProps = {
    value: value,
    onChange: (e, { newValue }) => {
      setValue(newValue);
    },
    onBlur: (e) => {
      //
    },
    type: 'text',
    placeholder: 'Type to find a place',
    'aria-label': 'location-search',
  };

  return (
    <Modal
      keepMounted
      open={modalOpened}
      onClose={handleClose}
      aria-labelledby="search-modal-title"
    >
      <Container>
        <Typography id="search-modal-title" sx={visuallyHidden}>
          Find a Place
        </Typography>
        <InputWrapper>
          <SearchIcon sx={{ margin: '0 1rem', fontSize: '2.5rem' }} />
          <Autosuggest
            suggestions={suggestions}
            onSuggestionSelected={handleSelection}
            onSuggestionsFetchRequested={handleFetchRequested}
            onSuggestionsClearRequested={handleClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
          {value && value.length > 0 && (
            <IconButton sx={{ margin: '0 1rem' }} onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          )}
        </InputWrapper>
        <Content>
          <Typography sx={{ fontSize: '1rem' }}>RECENT LOCATIONS</Typography>
          <Box display="flex" flexDirection="column">
            {recentLocations.reverse().map((location, index) => (
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #E0E0E0"
                padding="0.6rem 0"
                order={index}
                key={index}
              >
                <Box paddingRight="2rem">
                  <Typography>{location.suggestion.place_name}</Typography>
                </Box>
                <Button sx={{ minWidth: 200 }} variant="outlined">
                  Find Similar Places
                </Button>
              </Box>
            ))}
          </Box>
        </Content>
      </Container>
    </Modal>
  );
};

export default SearchModal;
