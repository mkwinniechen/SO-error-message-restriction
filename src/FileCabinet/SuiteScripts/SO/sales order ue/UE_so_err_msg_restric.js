/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @description 銷售訂單錯誤處理腳本 - 在建立訂單時 若錯誤欄位有值 則拒絕建立訂單
 * @author Roger Yueh
 * @since 2025.8
 * @dependencies custbody_sales_ec_order_mr_map
 */
define(["N/record", "N/error", "N/log"], (record, error, log) => {
  const beforeSubmit = (scriptContext) => {
    log.debug("beforeSubmit 開始執行", {
      type: scriptContext.type,
      newRecordId: scriptContext.newRecord.id,
    });

    const { newRecord, type } = scriptContext;

    // 檢查是否為建立或編輯事件
    if (
      type !== scriptContext.UserEventType.CREATE &&
      type !== scriptContext.UserEventType.EDIT
    ) {
      log.debug("跳過處理", "非建立或編輯事件");
      return;
    }

    const errorMessage = newRecord.getValue({
      fieldId: "custbody_sales_ec_order_mr_map",
    });

    log.debug("錯誤訊息欄位值", {
      fieldId: "custbody_sales_ec_order_mr_map",
      value: errorMessage,
      hasValue: !!errorMessage,
    });

    if (errorMessage && errorMessage.trim() !== "") {
      log.debug("準備拋出錯誤", errorMessage);

      // 在 beforeSubmit 中，直接拋出錯誤來阻止提交
      throw error.create({
        name: "ORDER_VALIDATION_ERROR",
        message: `訂單驗證失敗：${errorMessage}`,
        notifyOff: false,
      });
    } else {
      log.debug("錯誤訊息欄位為空，繼續處理");
    }
  };

  return { beforeSubmit };
});
