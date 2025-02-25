"use client";
import React from "react";
import { Input } from "@chakra-ui/react";
import { InputGroup } from "../../components/ui/input-group";
import { MdSearch } from "react-icons/md";
import { useForm } from "react-hook-form";
export default function Search() {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<{ search: string }>();

  const onSubmit = ({ search }: { search: string }) => {
    console.log(search);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup w={"100%"} mb={4} endElement={<MdSearch size={"1.5rem"} />}>
        <Input
          borderColor={"primary"}
          borderRadius={"1rem"}
          placeholder="Search..."
          size={"xl"}
          {...register("search")}
        />
      </InputGroup>
    </form>
  );
}
