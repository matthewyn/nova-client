import {
  Button,
  Input,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";

const COUNTRIES = [
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "Japan", code: "JP", dialCode: "+81" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "Mexico", code: "MX", dialCode: "+52" },
  { name: "Brazil", code: "BR", dialCode: "+55" },
  { name: "Spain", code: "ES", dialCode: "+34" },
  { name: "Italy", code: "IT", dialCode: "+39" },
  { name: "Netherlands", code: "NL", dialCode: "+31" },
  { name: "Sweden", code: "SE", dialCode: "+46" },
  { name: "Switzerland", code: "CH", dialCode: "+41" },
  { name: "South Korea", code: "KR", dialCode: "+82" },
  { name: "Singapore", code: "SG", dialCode: "+65" },
  { name: "New Zealand", code: "NZ", dialCode: "+64" },
  { name: "Ireland", code: "IE", dialCode: "+353" },
  { name: "Indonesia", code: "ID", dialCode: "+62" },
].sort((a, b) => a.name.localeCompare(b.name));

const getCountryFlag = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

const formatPhoneNumber = (value, countryCode) => {
  const digits = value.replace(/\D/g, "");

  const patterns = {
    US: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    },
    CA: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    },
    GB: (d) => {
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 11)}`;
    },
    AU: (d) => {
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 10)}`;
    },
    IN: (d) => {
      if (d.length <= 5) return d;
      return `${d.slice(0, 5)} ${d.slice(5, 10)}`;
    },
  };

  const formatter = patterns[countryCode];
  if (formatter) {
    return formatter(digits.slice(0, 15));
  }

  let formatted = "";
  for (let i = 0; i < digits.length && i < 15; i++) {
    if (i > 0 && i % 4 === 0) formatted += " ";
    formatted += digits[i];
  }
  return formatted;
};

function PhoneInput({
  selectedCountry,
  setSelectedCountry,
  setPhone,
  phone,
  countryIsDisabled = false,
}) {
  return (
    <div className="flex gap-2 items-stretch">
      <Popover placement="bottom-start">
        <PopoverTrigger className="flex">
          <Button
            variant="bordered"
            className="min-w-fit flex h-auto"
            isDisabled={countryIsDisabled}
          >
            {getCountryFlag(selectedCountry.code)} {selectedCountry.dialCode}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-64 overflow-y-auto">
          <Listbox
            aria-label="Country selection"
            className="pt-16"
            onAction={(key) => {
              const country = COUNTRIES.find((c) => c.code === key);
              if (country) {
                setSelectedCountry(country);
              }
            }}
          >
            {COUNTRIES.map((country) => (
              <ListboxItem key={country.code}>
                {getCountryFlag(country.code)} {country.name} (
                {country.dialCode})
              </ListboxItem>
            ))}
          </Listbox>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        isRequired
        label="Phone Number"
        placeholder="Phone number"
        value={formatPhoneNumber(phone, selectedCountry.code)}
        onChange={(e) => {
          const formatted = formatPhoneNumber(
            e.target.value,
            selectedCountry.code,
          );
          setPhone(formatted);
        }}
        className="flex-1"
        minLength={10}
      />
    </div>
  );
}

export { COUNTRIES, PhoneInput, formatPhoneNumber, getCountryFlag };
