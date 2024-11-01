import { Autocomplete, Chip, CircularProgress, debounce, TextField } from '@mui/material';
import React from 'react';

export const AutocompleteSearchInput = ({
  selectedCohosts = [],
  onSelected,
  searchFunction,
  noOptionsText,
  label,
  isMultiple = false,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedCohosts);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        searchFunction(request.input).then((results) => {
          callback(results);
        });
      }, 400),
    [searchFunction],
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(isMultiple && Array.isArray(value) ? value : []);
      return undefined;
    }

    setIsLoading(true);
    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (isMultiple) {
          if (Array.isArray(value)) {
            newOptions = [...value];
          }
        } else {
          if (value) {
            newOptions = [value];
          }
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch, isMultiple]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleOnChange = (event, newValue) => {
    if (isMultiple) {
      setValue(newValue);
      onSelected(newValue);
    } else {
      setValue(newValue);
      onSelected(newValue);
    }
  };

  return (
    <Autocomplete
      open={open}
      disabled={disabled}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleOnChange}
      getOptionLabel={(option) => option.userName ?? option.name ?? ''}
      multiple={isMultiple}
      loading={isLoading}
      options={options}
      autoComplete
      value={value}
      includeInputInList
      filterSelectedOptions
      noOptionsText={noOptionsText}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      filterOptions={(x) => x}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              variant='outlined'
              label={option.userName ?? option.name ?? ''}
              key={key}
              {...tagProps}
            />
          );
        })
      }
      getOptionDisabled={(option) =>
        Array.isArray(value) && (value.length > 5 || value.some((v) => v.name === option.name))
      }
    />
  );
};
