/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { addCabins } from "../../services/apiCabins";

function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editID, ...editValues } = cabinToEdit;
  console.log(editID, editValues);
  const isEditSession = Boolean(editID);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const quertClient = useQueryClient();
  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: addCabins,
    onSuccess: () => {
      toast.success("Cabin successfully created");
      quertClient.invalidateQueries("cabins");
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onSubmit = (newCabin) => {
    mutate({ ...newCabin, image: newCabin.image[0] });
  };
  // const onErrors = (errors) => {
  //   console.log(errors);
  // };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label='Cabin name' error={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          disabled={isCreating}
          {...register("name", {
            required: "This Cabin must have a name",
            minLength: {
              value: 3,
              message: "Cabin name should be at least 3 characters long",
            },
          })}
        />
      </FormRow>

      <FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
        <Input
          type='number'
          id='maxCapacity'
          disabled={isCreating}
          {...register("maxCapacity", {
            valueAsNumber: true,
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label='Regular price' error={errors?.regularPrice?.message}>
        <Input
          type='number'
          id='regularPrice'
          disabled={isCreating}
          {...register("regularPrice", {
            required: "This field is required",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label='Discount' error={errors?.discount?.message}>
        <Input
          type='number'
          id='discount'
          disabled={isCreating}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Discount cannot be negative",
            },
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label='Description for website'
        disabled={isCreating}
        error={errors?.description?.message}
      >
        <Textarea
          type='number'
          id='description'
          defaultValue=''
          disabled={isCreating}
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label='Cabin photo' disabled={isCreating}>
        {/* <Label htmlFor='image'>Cabin photo</Label> */}
        <FileInput
          id='image'
          accept='image/*'
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation='secondary' type='reset'>
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
