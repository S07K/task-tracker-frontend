import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  FormErrorMessage,
} from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCreateModal } from "../redux/eventActions";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL


const AddEventForm: React.FC<any> = ({ event, onEventAdd }: any) => {
  const dispatch = useDispatch();
  const [color, setColor] = useState('#333');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [title, setTitle] = useState("New Task");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { isCreateModalOpen } = useSelector((state: any) => state.event);

  const handleSaveCancel = () => {
    console.log("Clicked cancel save button");
    dispatch(toggleCreateModal(false));
  };

  const SaveEvent = async () => {
    const payload = {
      title: title,
      allDay: allDay,
      startStr: startDate.split('T')[0],
      endStr: endDate.split('T')[0],
      start: startDate,
      end: endDate,
      backgroundColor: color,
      url: '',
    }
    // console.log("Clicked save button", payload);
    try {
      setIsSaving(true);
      const res: any = await axios.post('/addEvent', payload)
      if(res.data && res.data.event){
        console.log('Event added', res.data.event)
        setIsSaving(false);
        dispatch(toggleCreateModal(false));
        onEventAdd();
      } else if(res.data && res.data.error){
        console.log('Error creating event', res.data.error)
        setIsSaving(false);
      }
    } catch (error) {
      console.log('Error creating event', error)
      setIsSaving(false);
    }
  };

  const toggleAllDayCheckBox = () => {
    setAllDay((prevState: Boolean) => {
      return !prevState;
    });
  };
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };
  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
  };
  const handleEndDateChange = (event: any) => {
    setEndDate(event.target.value);
  };
  useEffect(() => {
    console.log("Add: ", event);
    if (event) {
      setStartDate(event.startStr + `T00:00`);
      setEndDate(event.endStr + `T00:00`);
    }
  }, [event]);
  return (
    <>
      <Modal isOpen={isCreateModalOpen} onClose={handleSaveCancel}>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(4px)' />
        <ModalContent>
          <ModalHeader>Add new event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              {
                title === "" && <FormErrorMessage style={{display: 'flex'}}>Title is required.</FormErrorMessage>
              }
              <Input
                required
                errorBorderColor="#e53e3e"
                aria-errormessage="title is required"
                isInvalid={title === ""}
                value={title}
                onChange={handleTitleChange}
                placeholder="Event title"
              />
            </FormControl>
            <FormControl mt={4}>
              <Checkbox isChecked={allDay} onChange={toggleAllDayCheckBox}>
                All day event
              </Checkbox>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Event Color</FormLabel>
              <Button
                onClick={() => setShowColorPicker((prevState) => !prevState)}
                backgroundColor={color}
                color="white"
                style={{ cursor: "pointer" }}
                _hover={{ backgroundColor: color }}
              ></Button>
              <HexColorPicker style={
                {
                  display: showColorPicker ? 'block' : 'none',
                  position: 'absolute',
                  zIndex: 100,
                  marginTop: '6px',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  height: 'auto',
                  boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                  borderRadius: '5px',
                  background: '#fff',
                  padding: '10px',
                }
              } color={color} onChange={setColor} />
            </FormControl>
            {!allDay && (
              <>
                <FormControl mt={4}>
                  <FormLabel>From</FormLabel>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onInput={handleStartDateChange}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>To</FormLabel>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onInput={handleEndDateChange}
                  />
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={SaveEvent} isLoading={isSaving}>
              Save
            </Button>
            <Button onClick={handleSaveCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddEventForm;
