import { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { IoSearch } from 'react-icons/io5';
import styles from './CountrySelector.module.scss';
import classNames from 'classnames';
import { Input } from '../Input/Input';

interface Country {
  name: string;
  code: string;
}

const countries: Country[] = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Canada', code: 'CA' },
  { name: 'Australia', code: 'AU' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'India', code: 'IN' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Chile', code: 'CL' },
  { name: 'Mexico', code: 'MX' },
];

export interface CountrySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  name?: string;
}

export const CountrySelector = ({
  value,
  onChange,
  label,
  error,
  placeholder = 'Select a country',
  className,
  name,
}: CountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    countries.find((country) => country.code === value),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const country = countries.find((c) => c.code === value);
    setSelectedCountry(country);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    onChange?.(country.code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={classNames(styles.container, className)} ref={containerRef}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.selector}>
        <div
          className={classNames(styles.trigger, {
            [styles.error]: error,
            [styles.active]: isOpen,
          })}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={!selectedCountry ? styles.placeholder : ''}>
            {selectedCountry?.name || placeholder}
          </span>
          <IoChevronDown
            className={classNames(styles.arrow, { [styles.open]: isOpen })}
          />
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.searchWrapper}>
              <Input
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<IoSearch />}
              />
            </div>
            <div className={styles.options}>
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className={classNames(styles.option, {
                    [styles.selected]: selectedCountry?.code === country.code,
                  })}
                  onClick={() => handleSelect(country)}
                >
                  {country.name}
                </div>
              ))}
              {filteredCountries.length === 0 && (
                <div className={styles.noResults}>No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
