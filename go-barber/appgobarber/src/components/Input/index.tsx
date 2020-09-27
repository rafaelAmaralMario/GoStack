import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { color } from 'react-native-reanimated';
import { Container, TextInput, InputIcon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  { name, icon, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);
  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  const getIconColor = useCallback(() => {
    let iconColor = '#666360';

    if (isFocused || isFilled) {
      iconColor = '#ff9000';
    }

    if (error) {
      iconColor = '#c53030';
    }

    return iconColor;
  }, [error, isFocused, isFilled]);

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({
          text: value,
        });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [registerField, fieldName]);

  return (
    <>
      <Container isFocused={isFocused} isErrored={!!error}>
        <InputIcon name={icon} size={20} color={getIconColor()} />

        <TextInput
          ref={inputElementRef}
          placeholderTextColor="#666360"
          onChangeText={value => {
            inputValueRef.current.value = value;
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          {...rest}
        />
      </Container>
    </>
  );
};

export default forwardRef(Input);
