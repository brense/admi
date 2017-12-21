import * as React from 'react';
import Downshift from 'downshift';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

function renderInput(inputProps: any) {
    const { label, required, autoFocus, onChange, value, ref, ...other } = inputProps;

    return (
        <TextField
            autoFocus={autoFocus}
            label={label}
            value={value}
            required={required}
            inputRef={ref}
            onChange={onChange}
            InputProps={{
                ...other,
            }}
        />
    );
}

function renderSuggestion(params: any) {
    const { suggestion, index, itemProps, theme, highlightedIndex, selectedItem } = params;
    const isHighlighted = highlightedIndex === index;
    const isSelected = selectedItem === suggestion.label;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.label}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected
                    ? theme.typography.fontWeightMedium
                    : theme.typography.fontWeightRegular,
            }}
        >
            {suggestion.label}
        </MenuItem>
    );
}

function renderSuggestionsContainer(options: any) {
    const { containerProps, children } = options;

    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

function AutoComplete(props: any) {
    const { theme, suggestions, onChange, label, placeholder, required } = props;

    function getSuggestions(inputValue: any) {
        let count = 0;

        return suggestions.filter((suggestion: any) => {
            const keep =
                (!inputValue || suggestion.label.toLowerCase().includes(inputValue.toLowerCase())) &&
                count < 5;

            if (keep) {
                count += 1;
            }

            return keep;
        });
    }

    return (
        <Downshift
            onChange={onChange}
            render={({
        getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                selectedItem,
                highlightedIndex,
      }) => (
                    <div>
                        {renderInput(
                            getInputProps({
                                label: label,
                                placeholder: placeholder,
                                required: required,
                                onChange: onChange
                            }),
                        )}
                        {isOpen
                            ? renderSuggestionsContainer({
                                children: getSuggestions(inputValue).map((suggestion: any, index: number) =>
                                    renderSuggestion({
                                        suggestion,
                                        index,
                                        theme,
                                        itemProps: getItemProps({ item: suggestion.label }),
                                        highlightedIndex,
                                        selectedItem,
                                    }),
                                ),
                            })
                            : null}
                    </div>
                )}
        />
    );
}

export default withStyles({}, { withTheme: true })(AutoComplete);