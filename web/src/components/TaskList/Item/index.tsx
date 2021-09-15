import { EditIcon } from '@chakra-ui/icons';
import {
  Box, Flex, Heading, IconButton, Td, Text, Tr, useColorModeValue, VStack
} from '@chakra-ui/react';
import { FC } from 'react';
import { ITask, ListOptions } from '../../../typings';
import { getRandBgColor, timeSince } from '../../../utils';

interface IProps {
  data: ITask,
  variant: ListOptions['variant']
}

const Item: FC<IProps> = ({ data, variant }) => {
  const bg = useColorModeValue('gray.800', 'white')
  const color = useColorModeValue('gray.300', 'blackAlpha')
  const saturation = useColorModeValue(500, 200)

  if (variant === 'grid') {
    return (
      <Box bg={getRandBgColor(saturation)} h={300}>
        <VStack spacing={4}>
          <Heading color={color}>{data.name}</Heading>
          <Text color={color}>{data.description}</Text>
          <Flex px="7" py="5" alignItems="center">
            <Text fontSize="xs" color={color}>{timeSince(data.createdAt)}</Text>
            <Text fontSize="xs" color={color}>{data.finishedAt ? timeSince(data.finishedAt) : 'In process'}</Text>
            <IconButton
              ml={4}
              size="sm"
              fontSize="md"
              // onClick={logout}
              aria-label="Edit"
              icon={<EditIcon />}
            />
          </Flex>
        </VStack>
      </Box>
    )
  }

  return (
    <Tr>
      <Td>{data.name}</Td>
      <Td>{data.description}</Td>
      <Td>{data.type}</Td>
      <Td>{data.priority}</Td>
      <Td isNumeric>{timeSince(data.createdAt)}</Td>
      <Td isNumeric>{data.finishedAt ? timeSince(data.finishedAt) : 'In process'}</Td>
      <Td>
        <IconButton
          ml={4}
          size="sm"
          fontSize="md"
          // onClick={logout}
          aria-label="Edit"
          icon={<EditIcon />}
        />
      </Td>
    </Tr>
  )
}

export default Item;

