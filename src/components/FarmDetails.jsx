import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';
import UpdateFarmForm from './UpdateFarmForm';
import CustomNode from './CustomNode';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useEffect } from 'react';

const FarmDetails = ({ farm, onFarmUpdated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!farm.upstreams) return;

    const upstreamsCount = farm.upstreams.length;
    const ySpacing = 200; // Define the vertical spacing between upstream nodes
    const startY = 30 * upstreamsCount; // Position of the server farm node

    const newNodes = [
      {
        id: '1',
        data: { 
          header: farm['server_farm'], 
          algo: farm['algorithm'],
          port: farm['port']
        },
        position: { x: 0, y: startY },
        type: 'customNode', // Use 'customNode' type here
        sourcePosition: 'right',
      },
      ...farm.upstreams.map((upstream, index) => ({
        id: (index + 2).toString(),  // ID starts from '2'
        data: { 
          header: `${farm["server_farm"]}-${index + 1}`, 
          ip: upstream.ipaddress,
          port: upstream.port
        },
        position: { 
          x: 400, 
          y: startY + (index - Math.floor(upstreamsCount / 2)) * ySpacing, 
        },  // Space out vertically
        targetPosition: 'left',
        type: 'customNode', // Use 'customNode' type here as well
      })),
    ];

    const newEdges = farm.upstreams.map((_, index) => ({
      id: `1-${index + 2}`,  // Edge ID like '1-2', '1-3', etc.
      source: '1',            // The source is always the server farm node
      target: (index + 2).toString(),  // The target is the corresponding upstream node
      animated: true,
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [farm]); // Re-run the effect when the farm changes

  if (!farm) return null;

  return (
    <Box h="480px"  w="500px" mt={8} >
      {farm.upstreams ? (
                <Box h="400px" w="500px" borderWidth="1px" borderRadius="lg">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={{ customNode: CustomNode }}>
            <Background />
          </ReactFlow>
          <Button onClick={onOpen} colorScheme="yellow" mt={4}>Update</Button>
          <UpdateFarmForm isOpen={isOpen} onClose={onClose} onFarmUpdated={onFarmUpdated} farmData={farm} />
          </Box>
      ) : (
        <Text>No upstream server under this farm</Text>
      )}

    </Box>
  );
};

export default FarmDetails;

