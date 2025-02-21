import React, { useEffect } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '~/components/ui/select';

type CountrySelectorProps = {
  setValue: any;
  name: string;
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  setValue,
  name,
}) => {
  useEffect(() => {
    setValue(name, 'us');
  }, [name, setValue]);
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md px-4 sm:px-0">
        <div className="grid gap-6">
          <div className="flex items-center gap-4">
            <Select
              onValueChange={(country: string) => setValue(name, country)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder={'United States'} />
              </SelectTrigger>
              <SelectContent className="">
                <SelectGroup>
                  <SelectItem value="us" defaultChecked>
                    United States
                  </SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="at">Austria</SelectItem>
                  <SelectItem value="be">Belgium</SelectItem>
                  <SelectItem value="bg">Bulgaria</SelectItem>
                  <SelectItem value="hr">Croatia</SelectItem>
                  <SelectItem value="cy">Cyprus</SelectItem>
                  <SelectItem value="cz">Czech Republic</SelectItem>
                  <SelectItem value="dk">Denmark</SelectItem>
                  <SelectItem value="ee">Estonia</SelectItem>
                  <SelectItem value="fi">Finland</SelectItem>
                  <SelectItem value="gr">Greece</SelectItem>
                  <SelectItem value="hu">Hungary</SelectItem>
                  <SelectItem value="ie">Ireland</SelectItem>
                  <SelectItem value="it">Italy</SelectItem>
                  <SelectItem value="lv">Latvia</SelectItem>
                  <SelectItem value="lt">Lithuania</SelectItem>
                  <SelectItem value="lu">Luxembourg</SelectItem>
                  <SelectItem value="mt">Malta</SelectItem>
                  <SelectItem value="nl">Netherlands</SelectItem>
                  <SelectItem value="pl">Poland</SelectItem>
                  <SelectItem value="pt">Portugal</SelectItem>
                  <SelectItem value="ro">Romania</SelectItem>
                  <SelectItem value="sk">Slovakia</SelectItem>
                  <SelectItem value="si">Slovenia</SelectItem>
                  <SelectItem value="es">Spain</SelectItem>
                  <SelectItem value="se">Sweden</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
