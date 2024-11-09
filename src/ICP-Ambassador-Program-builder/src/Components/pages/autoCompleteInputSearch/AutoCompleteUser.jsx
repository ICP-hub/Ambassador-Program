import { Autocomplete, Chip, CircularProgress, debounce, TextField } from '@mui/material';
import React from 'react';

export const AutoCompleteUser = ({
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

  
  const fallbackOptions = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
  ];

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        try {
          searchFunction(request.input).then((results) => {
            callback(results.length ? results : fallbackOptions); 
          });
        } catch (error) {
          console.error("Search function error:", error);
          callback(fallbackOptions); 
        }
      }, 400),
    [searchFunction]
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      
      setOptions(fallbackOptions);
      return undefined;
    }

    setIsLoading(true);
    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = isMultiple ? [...(Array.isArray(value) ? value : [])] : value ? [value] : [];
        newOptions = [...newOptions, ...results];
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
    } else if (inputValue === '') {
      
      setOptions(fallbackOptions);
    }
  }, [open, inputValue]);

  const handleOnChange = (event, newValue) => {
    setValue(newValue);
    onSelected(newValue);
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
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option.userName ?? option.name ?? ''} {...getTagProps({ index })} />
        ))
      }
      getOptionDisabled={(option) =>
        Array.isArray(value) && (value.length > 5 || value.some((v) => v.name === option.name))
      }
    />
  );
};
