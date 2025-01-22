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
import { addFarm } from "../api/iptables";

const AddFarmForm = ({ isOpen, onClose, onFarmAdded }) => {
  const [newFarmData, setNewFarmData] = useState({
    upstreams: [{ ipaddress: "", port: "" }],
    port: "",
    algorithm: "round-robin",
    server_farm: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(validate());
  }, [newFarmData]);

  const validate = () => {
    const newErrors = {};
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const portRange = { min: 1, max: 65535 };

    if (!newFarmData.server_farm || newFarmData.server_farm.length < 5 || /[^a-zA-Z0-9]/.test(newFarmData.server_farm)) {
      newErrors.server_farm = "Server farm name must be at least 5 characters long and contain no special characters.";
    }

    if (!newFarmData.port || isNaN(newFarmData.port) || newFarmData.port < portRange.min || newFarmData.port > portRange.max) {
      newErrors.port = `Port must be a number between ${portRange.min} and ${portRange.max}.`;
    }

    newFarmData.upstreams.forEach((upstream, index) => {
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
    setNewFarmData({ ...newFarmData, [name]: value });
  };

  const handleUpstreamChange = (index, e) => {
    const { name, value } = e.target;
    const newUpstreams = [...newFarmData.upstreams];
    newUpstreams[index][name] = value;
    setNewFarmData({ ...newFarmData, upstreams: newUpstreams });
  };

  const addUpstreamField = () => {
    setNewFarmData({
      ...newFarmData,
      upstreams: [...newFarmData.upstreams, { ipaddress: "", port: "" }],
    });
  };

  const handleAddFarm = async () => {
    if (!validate()) return;

    try {
      await addFarm(newFarmData);
      onFarmAdded();
      onClose();
    } catch (error) {
      console.error("Error adding farm:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Server Farm</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={errors.server_farm}>
            <FormLabel>Server Farm Name</FormLabel>
            <Input
              name="server_farm"
              value={newFarmData.server_farm}
              onChange={handleInputChange}
            />
            {errors.server_farm && <FormErrorMessage>{errors.server_farm}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={4} isInvalid={errors.algorithm}>
            <FormLabel>Algorithm</FormLabel>
            <Select
              name="algorithm"
              value={newFarmData.algorithm}
              onChange={handleInputChange}
            >
              <option value="round-robin">Round Robin</option>
              <option value="least-connections">Least Connections</option>
              <option value="ip-hash">IP Hash</option>
            </Select>
          </FormControl>
          <FormControl mt={4} isInvalid={errors.port}>
            <FormLabel>Port</FormLabel>
            <Input
              name="port"
              value={newFarmData.port}
              onChange={handleInputChange}
            />
            {errors.port && <FormErrorMessage>{errors.port}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Upstreams</FormLabel>
            {newFarmData.upstreams.map((upstream, index) => (
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
                </FormControl>
              </Box>
            ))}
            <Button onClick={addUpstreamField} mt={2}>
              Add Upstream
            </Button>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAddFarm} isDisabled={!isFormValid}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddFarmForm;
