import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { colors } from "../../../data/filter/color";
import { useState } from "react";
import { prices } from "../../../data/filter/price";
import { useSearchParams } from "react-router-dom";
import { discounts } from "../../../data/filter/discount";
import { brands } from "../../../data/filter/brand";
import { Check } from "@mui/icons-material";

export const FilterSection = () => {
  const [expandColor, setExpandColor] = useState(false);
  const [expandBrand, setExpandBrand] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilterParams = (e) => {
    const { value, name } = e.target;
    if (value) {
      if (name === "price") {
        const selectedPrice = prices.find((p) => p.name === value);
        if (selectedPrice) {
          searchParams.set(
            "sellingPrice",
            `${selectedPrice.min}-${selectedPrice.max}`
          );
        }
      } else {
        searchParams.set(name, value);
      }
    } else if (name === "discount") {
      searchParams.set("discountPercent", value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const clearParams = () => {
    console.log("clearAllFilters", searchParams);
    searchParams.forEach((value, key) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams);
  };

  return (
    <div className="-z-50 space-y-5 bg-white hidden xl:block">
      <div className="flex items-center justify-between h-10 px-6 lg:border-r border-r-zinc-400">
        <p className="text-lg font-playfair">Filtros</p>

        <Button onClick={clearParams} size="small" variant="outlined">
          limpar filtros
        </Button>
      </div>

      <Divider />

      <div className="px-9 py-2">
        <div>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "1.25rem",
                color: "#000",
                fontWeight: "500",
                fontFamily: "Playfair Display",
              }}
              id="price"
            >
              Preços
            </FormLabel>
            <RadioGroup
              aria-labelledby="price"
              onChange={updateFilterParams}
              name="price"
            >
              {prices.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={<Radio size="small" />}
                  label={<p className="text-sm">{item.name}</p>}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      </div>

      <Divider variant="middle" />

      <div className="px-9 py-2">
        <div>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "1.25rem",
                color: "#000",
                fontWeight: "500",
                fontFamily: "Playfair Display",
              }}
              id="discount"
            >
              Descontos
            </FormLabel>
            <RadioGroup
              aria-labelledby="discount"
              onChange={updateFilterParams}
              name="discount"
            >
              {discounts.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" />}
                  label={<p className="text-sm">{item.name}</p>}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      </div>

      <Divider variant="middle" />

      <div className="px-9 py-2">
        <div>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "1.25rem",
                color: "#000",
                fontWeight: "500",
                fontFamily: "Playfair Display",
              }}
              id="color"
            >
              Cores
            </FormLabel>
            <RadioGroup
              aria-labelledby="color"
              onChange={updateFilterParams}
              name="color"
              className="flex flex-col gap-2 pt-2 pl-3"
            >
              {colors.slice(0, expandColor ? colors.length : 5).map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={<Radio sx={{ display: "none" }} />}
                  label={
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          backgroundColor: item.hex,
                          border:
                            item.name === "Branco" ? "1px solid #000" : "",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                        className="h-5 w-5 rounded-full"
                      >
                        {searchParams.get("color") === item.name && (
                          <Check
                            sx={{ fontSize: "1rem" }}
                            color={
                              item.name === "Preto" ? "secondary" : "primary"
                            }
                          />
                        )}
                      </span>

                      <p className="text-sm">{item.name}</p>
                    </div>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <div>
            <button
              className="cursor-pointer text-sm hover:text-blue-400 transition-colors duration-150"
              onClick={() => setExpandColor(!expandColor)}
            >
              {expandColor ? "Ver menos" : `+ ${colors.length - 5} cores`}
            </button>
          </div>
        </div>
      </div>

      <Divider variant="middle" />

      <div className="px-9 py-2">
        <div>
          <FormControl>
            <FormLabel
              sx={{
                fontSize: "1.25rem",
                color: "#000",
                fontWeight: "500",
                fontFamily: "Playfair Display",
              }}
              id="brand"
            >
              Marcas
            </FormLabel>
            <RadioGroup
              aria-labelledby="brand"
              onChange={updateFilterParams}
              name="brand"
            >
              {brands.slice(0, expandBrand ? brands.length : 5).map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={<Radio size="small" />}
                  label={
                    <div className="flex items-center gap-3">
                      <p className="text-sm">{item.name}</p>
                      <span
                        style={{ backgroundColor: item.hex }}
                        className={`h-4 w-4 rounded-full inline-block ${
                          item.name === "Branco" ? "border" : ""
                        }`}
                      ></span>
                    </div>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <div>
            <button
              className="cursor-pointer text-sm hover:text-blue-400 transition-colors duration-150"
              onClick={() => setExpandBrand(!expandBrand)}
            >
              {expandBrand ? "Ver menos" : `+ ${brands.length - 5} cores`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
