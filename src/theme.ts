import { extendTheme, defineStyleConfig } from "@chakra-ui/react";

// Neutral, minimal palette inspired by cal.com (Tailwind grays).
const gray = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827",
};

const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 500,
    borderRadius: "md",
    letterSpacing: "-0.005em",
  },
  sizes: {
    sm: { h: 8, px: 3, fontSize: "sm" },
    md: { h: 9, px: 4, fontSize: "sm" },
    lg: { h: "44px", px: 5, fontSize: "md" },
  },
  variants: {
    primary: {
      bg: "gray.900",
      color: "white",
      _hover: { bg: "gray.700", _disabled: { bg: "gray.900" } },
      _active: { bg: "gray.800" },
    },
    secondary: {
      bg: "white",
      color: "gray.900",
      border: "1px solid",
      borderColor: "gray.200",
      _hover: { bg: "gray.50", borderColor: "gray.300" },
      _active: { bg: "gray.100" },
    },
    minimal: {
      bg: "transparent",
      color: "gray.700",
      _hover: { bg: "gray.100", color: "gray.900" },
      _active: { bg: "gray.200" },
    },
    destructive: {
      bg: "white",
      color: "red.600",
      border: "1px solid",
      borderColor: "gray.200",
      _hover: { bg: "red.50", borderColor: "red.200" },
    },
    destructiveSolid: {
      bg: "red.600",
      color: "white",
      _hover: { bg: "red.700" },
    },
  },
  defaultProps: { variant: "secondary", size: "md" },
});

const fieldStyles = {
  field: {
    borderRadius: "md",
    borderColor: "gray.200",
    bg: "white",
    fontSize: "sm",
    _hover: { borderColor: "gray.300" },
    _focusVisible: {
      borderColor: "gray.900",
      boxShadow: "0 0 0 1px var(--chakra-colors-gray-900)",
    },
    _invalid: {
      borderColor: "red.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-red-500)",
    },
  },
};

const theme = extendTheme({
  colors: { gray },
  fonts: {
    heading: "'Inter', system-ui, -apple-system, sans-serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
  },
  styles: {
    global: {
      "html, body": {
        color: "gray.900",
        bg: "white",
      },
    },
  },
  components: {
    Button,
    Input: {
      variants: { outline: fieldStyles },
      sizes: { md: { field: { h: 9 } } },
    },
    FormLabel: {
      baseStyle: { fontSize: "sm", fontWeight: 500, color: "gray.700", mb: 1.5 },
    },
    Heading: {
      baseStyle: { letterSpacing: "-0.02em", fontWeight: 600 },
    },
    Modal: {
      baseStyle: {
        dialog: { borderRadius: "xl", boxShadow: "xl" },
        overlay: { bg: "blackAlpha.400" },
      },
    },
    Menu: {
      baseStyle: {
        list: { borderColor: "gray.200", boxShadow: "lg", py: 1, borderRadius: "lg" },
        item: { fontSize: "sm", _hover: { bg: "gray.100" }, _focus: { bg: "gray.100" } },
      },
    },
    Checkbox: {
      defaultProps: { colorScheme: "gray" },
      baseStyle: {
        control: {
          borderRadius: "sm",
          _checked: { bg: "gray.900", borderColor: "gray.900", _hover: { bg: "gray.700", borderColor: "gray.700" } },
        },
        label: { fontSize: "sm" },
      },
    },
  },
});

export default theme;
