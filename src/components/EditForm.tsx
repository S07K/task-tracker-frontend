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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleEditModal } from "../redux/eventActions";
import { HexColorPicker } from "react-colorful";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL

const EditForm: React.FC<any> = ({ event, onEventAdd }: any) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [color, setColor] = useState('#333');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { isEditModalOpen } = useSelector((state: any) => state.event);
  const [publicId, setPublicId] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleEditCancel = () => {
    console.log("Clicked edit button");
    dispatch(toggleEditModal(false));
  };
  const openDeleteConfirmDialog = () => {
    setIsConfirmDialogOpen(true);
  };
  const onConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
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

  const saveEvent = async () => {
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
    // console.log("Clicked edit save button: ", publicId, payload);
    try {
      setIsSaving(true);
      const res: any = await axios.patch(`/updateEvent/${publicId}`, payload)
      if(res.data && res.data.event){
        console.log('Event Updated', res.data.event)
        setIsSaving(false);
        dispatch(toggleEditModal(false));
        onEventAdd();
      } else if(res.data && res.data.error){
        console.log('Error Updating event', res.data.error)
        setIsSaving(false);
      }
    } catch (error) {
      console.log('Error Updating event', error)
      setIsSaving(false);
    }
  };
  const deleteEvent = async () => {
    try {
      setIsDeleting(true);
      const res: any = await axios.delete(`/deleteEvent/${publicId}`)
      if(res.data && res.data.events){
        console.log('Event Deleted', res.data.events)
        setIsDeleting(false);
        setIsConfirmDialogOpen(false);
        dispatch(toggleEditModal(false));
        onEventAdd();
      } else if(res.data && res.data.error){
        console.log('Error Updating event', res.data.error)
        setIsDeleting(false);
      }
    } catch (error) {
      console.log('Error Updating event', error)
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    console.log("Edit ", event);
    setPublicId(event.id);
    setColor(event.backgroundColor);
    setTitle(event.title);
    setAllDay(event.allDay);
    setStartDate(event.start);
    setEndDate(event.end);
  }, [event]);

  return (
    <>
      <Modal isOpen={isEditModalOpen} onClose={handleEditCancel}>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(4px)' />
        <ModalContent>
          <ModalHeader>Modify Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              {title === "" && (
                <FormErrorMessage style={{ display: "flex" }}>
                  Title is required.
                </FormErrorMessage>
              )}
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
              <HexColorPicker
                style={{
                  display: showColorPicker ? "block" : "none",
                  position: "absolute",
                  zIndex: 100,
                  marginTop: "6px",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  height: "auto",
                  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                  borderRadius: "5px",
                  background: "#fff",
                  padding: "10px",
                }}
                color={color}
                onChange={setColor}
              />
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
            <Button colorScheme="blue" mr={3} onClick={saveEvent} isLoading={isSaving} >
              Save
            </Button>
            <Button colorScheme="red" mr={3} onClick={openDeleteConfirmDialog} isLoading={isDeleting} >
              Delete
            </Button>
            <Button onClick={handleEditCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal closeOnOverlayClick={false} isOpen={isConfirmDialogOpen} onClose={onConfirmDialogClose}>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(4px)' />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            Are you sure you want to delete this event?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={deleteEvent} >
              Yes, Delete
            </Button>
            <Button onClick={onConfirmDialogClose}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditForm;
