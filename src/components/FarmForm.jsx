import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormErrorMessage,
} from "@chakra-ui/react";

const FarmForm = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [farmData, setFarmData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(validate());
  }, [farmData]);

  const validate = () => {
    const newErrors = {};
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const portRange = { min: 1, max: 65535 };

    if (!farmData.server_farm || farmData.server_farm.length < 5 || /[^a-zA-Z0-9]/.test(farmData.server_farm)) {
      newErrors.server_farm = "Server farm name must be at least 5 characters long and contain no special characters.";
    }

    if (!farmData.port || isNaN(farmData.port) || farmData.port < portRange.min || farmData.port > portRange.max) {
      newErrors.port = `Port must be a number between ${portRange.min} and ${portRange.max}.`;
    }

    farmData.upstreams.forEach((upstream, index) => {
      if (!ipRegex.test(upstream.ipaddress)) {
        newErrors[`upstreams[${index}].ipaddress`] = "Invalid IP address.";
      }
      if (!upstream.port || isNaN(upstream.port) || upstream.port < portRange.min || upstream.port > portRange.max) {
        newErrors[`upstreams[${index}].port`] = `Port must be a number between ${portRange.min} and ${portRange.max}.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFarmData({ ...farmData, [name]: value });
  };

  const handleUpstreamChange = (index, e) => {
    const { name, value } = e.target;
    const newUpstreams = [...farmData.upstreams];
    newUpstreams[index][name] = value;
    setFarmData({ ...farmData, upstreams: newUpstreams });
  };

  const addUpstreamField = () => {
    setFarmData({
      ...farmData,
      upstreams: [...farmData.upstreams, { ipaddress: "", port: "" }],
    });
  };

  const removeUpstreamField = (index) => {
    const newUpstreams = farmData.upstreams.filter((_, i) => i !== index);
    setFarmData({ ...farmData, upstreams: newUpstreams });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await onSubmit(farmData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={errors.server_farm}>
            <FormLabel>Server Farm Name</FormLabel>
            <Input
              name="server_farm"
              value={farmData.server_farm}
              onChange={handleInputChange}
            />
            {errors.server_farm && <FormErrorMessage>{errors.server_farm}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={4} isInvalid={errors.algorithm}>
            <FormLabel>Algorithm</FormLabel>
            <Select
              name="algorithm"
              value={farmData.algorithm}
              onChange={handleInputChange}
            >
              <option value="round-robin">Round Robin</option>
              <option value="random">Random</option>
            </Select>
          </FormControl>
          <FormControl mt={4} isInvalid={errors.port}>
            <FormLabel>Port</FormLabel>
            <Input
              name="port"
              value={farmData.port}
              onChange={handleInputChange}
            />
            {errors.port && <FormErrorMessage>{errors.port}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Upstreams</FormLabel>
            {farmData.upstreams.map((upstream, index) => (
              <Box key={index} mb={2}>
                <FormControl isInvalid={errors[`upstreams[${index}].ipaddress`]}>
                  <Input
                    name="ipaddress"
                    placeholder="IP Address"
                    value={upstream.ipaddress}
                    onChange={(e) => handleUpstreamChange(index, e)}
                    mb={2}
                  />
                  {errors[`upstreams[${index}].ipaddress`] && <FormErrorMessage>{errors[`upstreams[${index}].ipaddress`]}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={errors[`upstreams[${index}].port`]}>
                  <Input
                    name="port"
                    placeholder="Port"
                    value={upstream.port}
                    onChange={(e) => handleUpstreamChange(index, e)}
                  />
                  {errors[`upstreams[${index}].port`] && <FormErrorMessage>{errors[`upstreams[${index}].port`]}</FormErrorMessage>}
                  <Button colorScheme="red" onClick={() => removeUpstreamField(index)} mt={2}>
                  Remove
                </Button>
                </FormControl>
                
              </Box>
            ))}
            <Button onClick={addUpstreamField} mt={2}>
              Add Upstream
            </Button>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isDisabled={!isFormValid}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FarmForm;

