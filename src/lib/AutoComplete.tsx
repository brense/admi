import * as React from 'react';
import Downshift from 'downshift';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import { Cancel } from 'material-ui-icons';
import { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

let downshiftRef: {
  selectItem?: (suggestion: {}) => void;
  clearSelection?: () => void;
};

let hasItemSelected = false;

interface InputProps {
  label: string;
  required: boolean;
  autoFocus: boolean;
  onChange: () => void;
  onBlur?: () => void;
  value: string;
  ref: (instance: {}) => {};
}

function renderInput(inputProps: InputProps, error?: boolean, helperText?: string) {
  const { label, required, autoFocus, onChange, onBlur, value, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus={autoFocus}
      label={label}
      value={value}
      required={required}
      inputRef={ref}
      onChange={onChange}
      onBlur={() => {
        if (!hasItemSelected && downshiftRef.clearSelection) {
          downshiftRef.clearSelection();
        }
      }}
      helperText={helperText}
      error={error}
      fullWidth={true}
      InputProps={{
        ...other,
      }}
    />
  );
}

interface SuggestionParams {
  suggestion: {};
  index: number;
  itemProps: {};
  theme?: {
    typography?: {
      fontWeightMedium: 'normal' | 900,
      fontWeightRegular: 'normal' | 500
    }
  };
  highlightedIndex: number | null;
  selectedItem: {};
  itemToString: (item: {}) => string;
  createNew: (suggestion: {}) => void;
}

function renderSuggestion(params: SuggestionParams) {
  const { suggestion, index, itemProps, theme, highlightedIndex, selectedItem, itemToString, createNew } = params;
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem === suggestion;

  const isNew = createNew && createNew(suggestion);

  return (
    <MenuItem
      {...itemProps}
      key={index}
      selected={isHighlighted}
      onClick={() => {
        if (downshiftRef.selectItem) {
          hasItemSelected = true;
          downshiftRef.selectItem(suggestion);
        }
      }}
      component="div"
      style={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: 170,
        display: 'block',
        fontWeight: isSelected
          ? theme && theme.typography && theme.typography.fontWeightMedium
          : theme && theme.typography && theme.typography.fontWeightRegular,
      }}
    >
      {isNew && <Typography variant="body2" style={{display: 'inline'}}>{isNew}</Typography>}
      {suggestion && itemToString(suggestion)}
    </MenuItem>
  );
}

function renderSuggestionsContainer(options: { containerProps?: {}, children: {} }) {
  const { containerProps, children } = options;

  return (
    <Paper
      {...containerProps}
      square={true}
      style={{
        position: 'absolute',
        zIndex: 999
      }}
    >
      {children}
    </Paper>
  );
}

interface AutomCompleteProps {
  suggestions: {}[];
  margin?: string;
  value?: string;
  fullWidth?: boolean;
  theme?: {};
  onChange: (suggestion: {}) => void;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
  label: string | undefined;
  placeholder: string | undefined;
  required: boolean | undefined;
  itemToString: (item: {}) => string;
  filter: (inputValue: string | null) => {}[];
  createNew: (suggestion: {}) => void;
}

function AutoComplete(props: AutomCompleteProps) {
  const {
    theme,
    onChange,
    error,
    helperText,
    onBlur,
    label,
    placeholder,
    required,
    itemToString,
    filter,
    createNew
  } = props;

  function clear() {
    hasItemSelected = false;
    if (downshiftRef.clearSelection) {
      downshiftRef.clearSelection();
    }
  }

  return (
    <Downshift
      onChange={onChange}
      ref={(d) => { downshiftRef = d as {}; }}
      itemToString={itemToString}
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex,
      }) => (
          <div style={{ position: 'relative' }}>
            {renderInput(
              getInputProps({
                label: label,
                placeholder: placeholder,
                required: required,
                onChange: onChange,
                onBlur: onBlur,
              }),
              error,
              helperText
            )}
            {isOpen
              ? renderSuggestionsContainer({
                children: filter(inputValue)
                  .map((suggestion: { name: string }, index: number) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      theme,
                      itemProps: getItemProps({ item: suggestion }),
                      highlightedIndex,
                      selectedItem,
                      itemToString,
                      createNew
                    }),
                ),
              })
              : null}
            {selectedItem && <IconButton
              style={{ position: 'absolute', top: 20, right: 0, width: 'auto', height: 'auto' }}
              onClick={clear}
            >
              <Cancel />
            </IconButton>}
          </div>
        )}
    />
  );
}

export default withStyles({}, { withTheme: true })(AutoComplete);
