import { useMapStore } from '@hyperobjekt/mapgl';
import { Box, Modal, Typography, IconButton } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import shallow from 'zustand/shallow';
import Autosuggest from 'react-autosuggest';
import { MAPBOX_TOKEN, FULL_FUNCT_ZOOM_THRESHOLD, FLY_TO_ZOOM } from 'App/shared/constants';
import { useSearchStore } from '../../store';
import { Container, InputWrapper, Content, SuggestionDiv } from './SearchModal.styles';

const SEARCH_MIN = 3;

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

  const [includedCities, setIncludedCities] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const [highlighted, setHighlighted] = useState(null);

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
    if (inputValue.length < SEARCH_MIN) {
      return setSuggestions([]);
    } else {
      const path =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputValue}.json?` +
        `access_token=${MAPBOX_TOKEN}&cachebuster=${Math.floor(
          Date.now(),
        )}&autocomplete=true&country=US&types=region,place${
          viewport?.zoom > FULL_FUNCT_ZOOM_THRESHOLD
            ? `&proximity=${viewport.longitude},${viewport.latitude}`
            : ``
        }`;
      fetch(path)
        .then((r) => r.json())
        .then((json) => {
          // Limit to states or city with data on map
          return json.features.filter(
            (f) => f.place_type.includes('region') || includedCities.includes(f.place_name),
          );
        })
        .then((results) => {
          setSuggestions(results);
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
    setRecentLocations(
      recentLocations.length < 5
        ? [...recentLocations, suggestion]
        : [...recentLocations.slice(1), suggestion],
    );
    setModalOpened(false);
    handleClear();
  };

  const handleClickRecentLocation = (suggestion) => {
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

  const renderSuggestionsContainer = ({ containerProps, children, query }) => {
    return query.length >= SEARCH_MIN ? (
      <div {...containerProps}>
        {children ? (
          children
        ) : (
          <Typography sx={{ padding: '1em' }}>{`No data available for "${query}"`}</Typography>
        )}
      </div>
    ) : null;
  };

  const renderSuggestion = (suggestion) => {
    const isHighlighted = highlighted?.id === suggestion?.id;
    return (
      <SuggestionDiv
        id={suggestion.id}
        key={suggestion.id}
        style={{
          backgroundColor: isHighlighted ? '#0D7682' : 'transparent',
          color: isHighlighted ? '#FFF' : '#000',
        }}
      >
        {suggestion.place_name}
      </SuggestionDiv>
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

  useEffect(() => {
    (async () => {
      const cities = await fetch('./assets/data/cities.csv')
        .then((r) => r.text())
        .then((text) => {
          let rows = text
            .split(/(?:\r\n|\n)+/)
            .filter((row) => row.length !== 0)
            .map((row) => row.replace(/^"|"$/g, '') + ', United States');
          return rows;
        });
      await setIncludedCities(cities);
    })();
  }, []);

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
            renderSuggestionsContainer={renderSuggestionsContainer}
            renderSuggestion={renderSuggestion}
            onSuggestionHighlighted={({ suggestion }) => {
              setHighlighted(suggestion);
            }}
            inputProps={inputProps}
          />
          {value && value.length > 0 && (
            <IconButton sx={{ margin: '0 1rem' }} onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          )}
        </InputWrapper>
        <Content>
          <Typography sx={{ fontSize: '1rem', marginBottom: '1rem' }}>RECENT LOCATIONS</Typography>
          <Box display="flex" flexDirection="column">
            {[...recentLocations].reverse().map((location, index) => {
              return (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom="1px solid #E0E0E0"
                  padding="0.6rem 0"
                  order={index}
                  key={index}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleClickRecentLocation(location);
                  }}
                >
                  <Box paddingRight="2rem">
                    <Typography>{location.suggestion.place_name}</Typography>
                  </Box>
                  {/* <Button sx={{ minWidth: 200 }} variant="outlined">
                  Find Similar Places
                </Button> */}
                </Box>
              );
            })}
          </Box>
        </Content>
      </Container>
    </Modal>
  );
};

export default SearchModal;
