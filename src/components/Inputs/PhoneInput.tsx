import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export interface PhoneInputProps {
  onChange: (
    dialCode: string,
    phoneNumber: string,
    formattedPhoneNumber: string,
  ) => void;
}
export const PhoneInputField: React.FC<PhoneInputProps> = ({ onChange }) => {
  return (
    <PhoneInput
      country={'us'}
      containerStyle={{
        fontFamily: 'HK Grotesk',
        borderRadius: '5px',
        border: '1px solid hsl(214.3 31.8% 91.4%)',
      }}
      buttonStyle={{
        border: 'none',
      }}
      inputStyle={{
        width: '100%',
        background: 'hsl(0 0% 100%)',
        height: '40px',
        fontFamily: 'HK Grotesk',
        border: 'none',
      }}
      onChange={(value, country: any, e, formattedPhoneNumber: string) => {
        const dialCode = country.dialCode;
        const phoneNumber = value.slice(country.dialCode.length);

        onChange(dialCode, phoneNumber, formattedPhoneNumber);
      }}
    />
  );
};
