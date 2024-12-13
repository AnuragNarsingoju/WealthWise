import react ,{useState,useEffect} from "react";
import Navbar from "./navbar";
import ExpenseComparison from "./ExpenseComparison";
import BudgetPieChart from "./BudgetPieChart";

const ExpenseTracker = () => {
    return ( 
        <>
        <div className="relative bg-gradient-to-br 
                from-blue-600/90 
                to-purple-600/90 
                "><Navbar/></div>
        
        <div className="
            min-h-screen 
            w-full 
            bg-gradient-to-br 
            from-blue-600/90 
            to-purple-600/90 
            overflow-x-hidden
            flex-row 
            items-center 
            justify-center
            "
        >
            <ExpenseComparison/>
            <BudgetPieChart/>
        </div>
       
        
        </>
     );
}
 
export default ExpenseTracker;