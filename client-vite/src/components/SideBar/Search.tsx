import { Input } from "@chakra-ui/react";
import { InputGroup } from "../../components/ui/input-group";
import { MdSearch, MdClear } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Search({
  setSearchValue,
}: {
  setSearchValue: Dispatch<SetStateAction<string>>;
}) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm") || ""
  );
  const [value] = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearchValue(value);
  }, [value, setSearchValue]);

  useEffect(() => {
    // Custom logic to handle the refresh and store searchTerm in localstorage
    const handleBeforeUnload = () => {
      localStorage.setItem("searchTerm", value);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [value]);

  const {
    register,
    setFocus,
    // handleSubmit,
    // formState: { errors },
  } = useForm<{ search: string }>();

  return (
    <form>
      <InputGroup
        w={"100%"}
        mb={4}
        endElement={
          searchTerm ? (
            <MdClear onClick={() => setSearchTerm("")} size={"1.5rem"} />
          ) : (
            <MdSearch onClick={() => setFocus("search")} size={"1.5rem"} />
          )
        }
      >
        <Input
          borderColor={"primary"}
          borderRadius={"1rem"}
          placeholder="Search..."
          size={"xl"}
          value={searchTerm}
          autoComplete="on"
          {...register("search", {
            onChange: (e) => {
              setSearchTerm(e.target.value);
            },
            onBlur: (e) => {
              if (e.target.value === "") {
                navigate("/messages");
              }
            },
          })}
        />
      </InputGroup>
    </form>
  );
}
