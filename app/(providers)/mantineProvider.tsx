import { ColorScheme, ColorSchemeProvider, createStyles, MantineProvider } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks";

export default function MantineWrapper({
  children,
}: {
  children: React.ReactNode
}) {

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };


  return (
    <MantineProvider theme={{ colorScheme, fontFamily: "Manrope, sans-serif"}} withGlobalStyles>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          {children}
        </ColorSchemeProvider>
    </MantineProvider>
  )
}