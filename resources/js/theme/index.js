import { extendTheme } from '@chakra-ui/react';

import { button, input } from './components';
import { typography } from './foundations';
import { globalStyles } from './styles';

const theme = extendTheme(globalStyles, button, input, typography);

export default theme;
