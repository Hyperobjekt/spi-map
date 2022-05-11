import { Box, Button, FormControlLabel, Switch } from '@mui/material';
import { styled } from '@mui/system';
import clsx from 'clsx';
import React from 'react';
import shallow from 'zustand/shallow';
import useIndicatorPanelStore from '../store';

const StyledBox = styled(Box)({
  width: '100%',
  '& .MuiFormControlLabel-label': {
    fontSize: 12,
  },
});

const CustomizeIndicatorsToggle = ({
  onCustomize,
  onToggleCustomized,
  hasCustomized,
  enableCustomized,
  switchLabel = 'Use Customized Indicators',
  buttonLabel = 'Customize Indicators',
  editLabel = 'Edit',
  className,
  ...props
}) => {
  return (
    <StyledBox
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={2}
      className={clsx('customize-toggle__root', className)}
      {...props}
    >
      {hasCustomized && (
        <FormControlLabel
          className="customize-toggle__label"
          control={
            <Switch
              className="customize-toggle__switch"
              checked={enableCustomized}
              onClick={onToggleCustomized}
            />
          }
          label={switchLabel}
        />
      )}
      <Button
        className="customize-toggle__button"
        fullWidth={!hasCustomized}
        variant="contained"
        size="small"
        color="primary"
        onClick={onCustomize}
      >
        {hasCustomized ? editLabel : buttonLabel}
      </Button>
    </StyledBox>
  );
};

const ConnectedCustomizeIndicatorsToggle = (props) => {
  const [enableCustomized, customizedMetrics, setEnableCustomized, setCustomizeOpen] =
    useIndicatorPanelStore(
      (state) => [
        state.enableCustomized,
        state.customizedMetrics,
        state.setEnableCustomized,
        state.setCustomizeOpen,
      ],
      shallow,
    );
  const hasCustomized = customizedMetrics.length > 0;
  const handleCustomizeIndicators = () => {
    setCustomizeOpen(true);
  };
  const handleToggleCustomized = () => {
    console.count('toggle');
    setEnableCustomized(!enableCustomized);
  };

  return (
    <CustomizeIndicatorsToggle
      onCustomize={handleCustomizeIndicators}
      onToggleCustomized={handleToggleCustomized}
      hasCustomized={hasCustomized}
      enableCustomized={enableCustomized}
      showToggle={hasCustomized}
      {...props}
    />
  );
};

export default ConnectedCustomizeIndicatorsToggle;
