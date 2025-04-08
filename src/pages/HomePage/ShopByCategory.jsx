import { Box , Typography} from "@mui/material";
import { sortedSearchCategoryDropDown } from "../../components/Navbar";

export default function ShopByCategory(){
    return(
        <Box category="section" sx={{margin:"16px", padding:"8px", minHeight: "fit-content"}}>
            {
                sortedSearchCategoryDropDown.map((item)=>{
                    return <Typography variant="body2" key={item} sx={{ cursor: "pointer" }}>
                    {item}
                </Typography>
                })
            }
        </Box>
    );
}