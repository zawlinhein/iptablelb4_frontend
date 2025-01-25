import { Box, useDisclosure, Text, Heading, Icon, VStack } from '@chakra-ui/react';
import {  Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';

// Custom handle style for spacing
const handleStyle = { left: 10 };

// Custom Node definition
function CustomNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
     <Handle type="target" position="left" />
    <Box
      p={4}
      borderRadius="lg"
      bg="gray.50" // Light gray background for card
      boxShadow="lg"
      maxW="sm"
    >
      {/* Header Section */}
      <Box
        w="100%"
        p={2}
        bg="teal.300" // Teal background for header
        borderRadius="lg"
        display="flex"
        alignItems="left"
      >
        <Text color="white">
          {data.header}
        </Text>
      </Box>

      {/* Content Section */}
      <Box mt={4}>
        <VStack align="start" spacing={2}>
        {data.algo &&<Text fontSize="sm" color="gray.700"> {/* Dark gray text for readability */}
                            Algorithm : <strong>{data.algo}</strong>
          </Text>}
        {data.ip &&<Text fontSize="sm" color="gray.700"> {/* Lighter gray for secondary text */}
                            IP-Address : <strong>{data.ip}</strong>
          </Text>}
        {data.port &&<Text fontSize="sm" color="gray.700"> {/* Lighter gray for secondary text */}
                            Port : <strong>{data.port}</strong>
          </Text>}
        </VStack>
      </Box>
    </Box>
    <Handle type="source" position="right" id="a" />
    </>
  );
}
export default CustomNode;
