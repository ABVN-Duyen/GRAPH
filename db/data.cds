//Struc for Matrix
entity app.interactions.INPUT_SAMPLE_MATRIX {
        LARGECLS   : String(50)  @title: 'Large Classification';
        MINORCLS   : String(100) @title: 'Minor Classification';
        DEPVARNAME : String(100) @title: 'Dependent Variable Name';
        EPLVARNUM  : String(50)  @title: 'Explanatory Variable Number';
        EPLVARNAME : String(500) @title: 'Explanatory Variable Name';
        DESIREDCOR : String(50)  @title: 'Desired Correlation';
        NOY        : String(50)  @title: 'Number of Years';
        REGCOE     : Double      @title: 'Regression Coefficent';
        FREEADJCOE : Double      @title: 'Freedom Adjust Coefficent Value';
        PVALUE     : Double      @title: 'p-value';
        CLIENT     : String(200) @title: 'Client';
}

//Struc for Matrix
entity app.interactions.CLIENTS {
        key CLIENTKEY  : String(200) @title: 'Client';
            CLIENTNAME : String(200) @title: 'Client Name';
}

entity db.NODES_VIEW {

        key NODEKEY    : String(200) @title: 'NODEKEY';
        key CLIENT     : String(50)  @title: 'CLIENT';
            NODETITLE  : String(100) @title: 'NODETITLE';
            NODESTATUS : String(50)  @title: 'NODESTATUS';
            NODESHAPE  : String(50)  @title: 'NODESHAPE';
            NODEGROUP  : String(50)  @title: 'NODEGROUP';

}

entity db.LINES_VIEW {

        key LINEFROM   : String(100) @title: 'LINEFROM';
        key LINETO     : String(100) @title: 'LINETO';
        key CLIENT     : String(50)  @title: 'CLIENT';
            LINESTATUS : String(50)  @title: 'LINESTATUS';
            LINETYPE   : String(50)  @title: 'LINETYPE';

}

entity db.INPUT_VIEW {

        key SOURCE       : String(100) @title: 'SOURCE';
        key INDSOURCE    : String(100) @title: 'INDICATOR SOURCE';
        key DESTINATION  : String(100) @title: 'DESTINATION';
        key INDDEST      : String(100) @title: 'INDICATOR DESTINATION';
        key CLIENT       : String(100) @title: 'CLIENT';
            RELATIONSHIP : String(50)  @title: 'RELATIONSHIP';
            AREA         : String(50)  @title: 'SOURCE AREA';
            DESAREA      : String(50)  @title: 'DESTINATION AREA';

}

entity db.GROUP_VIEW {

        key GROUPKEY : String(100) @title: 'GROUP KEY';
        key CLIENT   : String(50)  @title: 'CLIENT';
            TITLE    : String(100) @title: 'TITLE';

}

entity db.CLIENT_VIEW {

        key CLIENTKEY   : String(50) @title: 'CLIENT';
        key CLIENT_ITEM : String(50) @title: 'CLIENT ITEM';
            TITLE       : String(50) @title: 'TITLE';
            MATRIX      : String(1)  @title: 'MATRIX ACTIVATION';
            CHART       : String(1)  @title: 'CHART ACTIVATION';
}

entity db.SIGNIFICANT {
        key CLIENT         : String(100) @title: 'CLIENT';
        key CLIENT_ITEM    : String(100) @title: 'CLIENT ITEM';
        key SOURCE         : String(100) @title: 'SOURCE';
        key INDSOURCE      : String(100) @title: 'INDICATOR SOURCE';
        key DESTINATION    : String(100) @title: 'DESTINATION';
        key INDDEST        : String(100) @title: 'INDICATOR DESTINATION';
            VALID_HYPO_FLG : String(100) @title: 'VALID IN HYPOTHESIS LIST';
            CORR_MATCH_FLG : String(100) @title: 'CORRELATION MATCH';
}

entity db.FINAL {
        key CLIENT      : String(100) @title: 'CLIENT';
        key CLIENT_ITEM : String(100) @title: 'CLIENT ITEM';
        key SOURCE      : String(100) @title: 'SOURCE';
        key INDSOURCE   : String(100) @title: 'INDICATOR SOURCE';
        key DESTINATION : String(100) @title: 'DESTINATION';
        key INDDEST     : String(100) @title: 'INDICATOR DESTINATION';
            MATCH_FLAG  : String(100) @title: 'MATCH WITH SIGNIFICANT LIST';
            NEW_FLAG    : String(100) @title: 'NEW WITH OLD FINAL';
            AREA        : String(100) @title: 'SOURCE AREA';
            DESAREA     : String(100) @title: 'DESTINATION AREA';
}

entity db.VALUE_RELEVANCE_ANALYSIS {
        key CLIENT             : String(100) @title: 'CLIENT';
        key CLIENT_ITEM        : String(100) @title: 'CLIENT ITEM';
        key SEQUENCE_NO        : String(100) @title: 'Consecutive Integer';
            DEP_VAR            : String(100) @title: 'Dependent variable';
            DEP_NAME           : String(100) @title: 'Dependent variable description';
            DEP_NO             : String(100) @title: 'Dependent variable number';
            DEP_ITM_NO         : String(100) @title: 'Item No. (dependent variable)';
            DEP_ITM_NAME       : String(200) @title: 'Item (dependent variable)';
            INTERCEPT          : String(100) @title: 'Intercept';
            RE_COEFFICIENT     : String(100) @title: 'Regression coefficients';
            STD_ERROR          : String(100) @title: 'Standard error';
            T_VAL              : Double      @title: 'T Value';
            P_VAL              : Double      @title: 'P Value';
            LOW_BOUND          : String(100) @title: 'Lower bound of 95% confidence interval';
            UPP_BOUND          : String(100) @title: 'Upper bound of 95% confidence interval';
            EXPL_VAR_1         : String(100) @title: 'Explainatory variable 1';
            RE_COEFFICIENT_1   : String(100) @title: 'Regression coefficients 1';
            STD_ERROR_1        : String(100) @title: 'Standard error 1';
            T_VAL_1            : Double      @title: 'T Value 1 ';
            P_VAL_1            : Double      @title: 'P Value 1';
            LOW_BOUND_1        : String(100) @title: 'Lower bound of 95% confidence interval';
            UPP_BOUND_1        : String(100) @title: 'Upper bound of 95% confidence interval';
            EXPL_VAR_NAME_1    : String(200) @title: 'Explainatory variable 1 Name';
            OBSER_NO           : String(100) @title: 'No of observations';
            DE_COEFFICIENT     : String(100) @title: 'Determined coefficient';
            DE_COEFFICIENT_AFT : String(100) @title: 'Determined coefficient after degrees of freedom adjustment';
            STD_ERROR_REG      : String(100) @title: 'Standard error of regression';
            F_VALUE            : Double      @title: 'F Value';
            EXPL_VAR_NO        : String(100) @title: 'No of explanatory variable';
            DEG_FREE           : String(100) @title: 'Degree of freedom';
            P_VALUE_F          : Double      @title: 'P value of F test';
            SHIFT_YEAR         : String(100) @title: 'Shifted years';
            EXPL_VAR_ITM_NO    : String(100) @title: 'Item No( explanatory variable)';
            EXPL_VAR_ITM_NAME  : String(200) @title: 'Item( explanatory variable)';
            EXPL_VAR           : String(100) @title: 'Explanatory variable';
            DESIRED_CORR       : String(100) @title: 'Desired correlation';
}

//app Matrix
entity db.OVERLOOKING_ANALYSIS {
        key CLIENT             : String(100) @title: 'CLIENT';
        key CLIENT_ITEM        : String(100) @title: 'CLIENT ITEM';
        key SEQUENCE_NO        : String(100) @title: 'Consecutive Integer';
            DEP_VAR            : String(100) @title: 'Dependent variable';
            DEP_NAME           : String(200) @title: 'Dependent variable description';
            DEP_NO             : String(100) @title: 'Dependent variable number';
            DEP_ITM_NO         : String(100) @title: 'Item No. (dependent variable)';
            DEP_ITM_NAME       : String(500) @title: 'Item (dependent variable)';
            INTERCEPT          : String(100) @title: 'Intercept';
            RE_COEFFICIENT     : String(100) @title: 'Regression coefficients';
            STD_ERROR          : String(100) @title: 'Standard error';
            T_VAL              : Double      @title: 'T Value';
            P_VAL              : Double      @title: 'P Value';
            LOW_BOUND          : String(100) @title: 'Lower bound of 95% confidence interval';
            UPP_BOUND          : String(100) @title: 'Upper bound of 95% confidence interval';
            EXPL_VAR_1         : String(100) @title: 'Explainatory variable 1';
            RE_COEFFICIENT_1   : String(100) @title: 'Regression coefficients 1';
            STD_ERROR_1        : String(100) @title: 'Standard error 1';
            T_VAL_1            : Double      @title: 'T Value 1';
            P_VAL_1            : Double      @title: 'P Value 1';
            LOW_BOUND_1        : String(100) @title: 'Lower bound of 95% confidence interval 1';
            UPP_BOUND_1        : String(100) @title: 'Upper bound of 95% confidence interval 1';
            EXPL_VAR_2         : String(100) @title: 'Explainatory variable 2';
            RE_COEFFICIENT_2   : Double      @title: 'Regression coefficients 2';
            STD_ERROR_2        : String(100) @title: 'Standard error 2';
            T_VAL_2            : Double      @title: 'T Value 2';
            P_VAL_2            : Double      @title: 'P Value 2';
            LOW_BOUND_2        : String(100) @title: 'Lower bound of 95% confidence interval 2';
            UPP_BOUND_2        : String(100) @title: 'Upper bound of 95% confidence interval 2';
            EXPL_VAR_NAME_1    : String(500) @title: 'Explainatory variable 1 Name';
            EXPL_VAR_NAME_2    : String(500) @title: 'Explainatory variable 2 Name';
            OBSER_NO           : String(100) @title: 'No of observations';
            DE_COEFFICIENT     : String(100) @title: 'Determined coefficient';
            DE_COEFFICIENT_AFT : Double      @title: 'Determined coefficient after degrees of freedom adjustment';
            STD_ERROR_REG      : String(100) @title: 'Standard error of regression';
            F_VALUE            : Double      @title: 'F Value';
            EXPL_VAR_NO        : String(100) @title: 'No of explanatory variable';
            DEG_FREE           : String(100) @title: 'Degree of freedom';
            P_VALUE_F          : Double      @title: 'P value of F test';
            SHIFT_YEAR         : String(100) @title: 'Shifted years';
            EXPL_VAR_ITM_NO    : String(100) @title: 'Item No( explanatory variable)';
            EXPL_VAR_ITM_NAME  : String(500) @title: 'Item( explanatory variable)';
            EXPL_VAR           : String(100) @title: 'Explanatory variable';
            DESIRED_CORR       : String(100) @title: 'Desired correlation';
            MAJ_CLASS          : String(100) @title: 'Major Classification';
            MIN_CLASS          : String(100) @title: 'Minor Classification';
}

//App upload master & transaction data
// entity db.ESG_MEASURE_MASTER {
//         key VAR               : String(100);
//             VAR_NAME          : String(500);
//             VAR_NO            : Integer;
//             VAR_ITM_NO        : Integer;
//             VAR_ITM_NAME      : String(500);
//             DIRECTION         : String(1);
//             EXCL_FLAG         : String(1);
//             MAJ_CLASS         : String(500);
//             MIN_CLASS         : String(500);
//             SCT_ENTITY        : String(100);
//             MEASURE_ID        : String(100);
//             DIM_ID            : String(100);
//             DIM_VAL           : String(1000);
//             DS_SCT            : String(500);
//             DS_MANUAL         : String(500);
//             STAGG_YEAR_MATRIX : Integer;
//             STAGG_YEAR_VRC    : Integer;
//             FLAG_MATRIX       : String(1);
//             FLAG_VRC          : String(1);
//             PERIOD_START      : String(100);
//             PERIOD_END        : String(100);

// }

// entity db.ESG_MANUAL_TRANS {
//         key VAR   : String(100);
//         key YEAR  : String(100);
//             VALUE : Decimal(31, 14);
// }
