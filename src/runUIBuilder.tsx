import { IDateTimeField, IFormulaField, IOpenTimestamp, ITable, UIBuilder } from "@lark-base-open/js-sdk";
import { UseTranslationResponse } from 'react-i18next';
import { string2Date } from "./utils";

export default async function(uiBuilder: UIBuilder, { t }: UseTranslationResponse<'translation', undefined>) {
  uiBuilder.markdown(`
  #### 公式日期转日期
  > 欢迎使用日期转换器，选择利用公式生成日期的属性转换为日期类型的属性列
  `);
  uiBuilder.form((form) => ({
    formItems: [
      form.tableSelect('table', { label: '选择数据表' }),
      form.fieldSelect('sourceField', { label: '源属性', sourceTable: 'table'}),
      form.fieldSelect('targetField', { label: '目标属性', sourceTable: 'table'}),
    ],
    buttons: ['确定', '取消'],
  }), async ({ key, values }) => {
    if (key === '取消') {
      return; // 点击取消按钮不处理任何业务
    }

    const table = values.table as ITable;
    const sourceField = values.sourceField as IFormulaField;
    const targetField = values.targetField as IDateTimeField;

    uiBuilder.showLoading('获取文本数据');
    const fvs = await sourceField.getFieldValueList();
    
    uiBuilder.showLoading('写入结果');

    const promises: any[] = [];
    fvs.forEach(v => {
      const key = v.record_id as string;
      const value = string2Date(v.value as string);

      promises.push(
        table.setCellValue(
          targetField.id,
          key,
          value as IOpenTimestamp,
        ),
      );
    });
    await Promise.all(promises);

    uiBuilder.hideLoading();
    uiBuilder.message.success('转换完成');
  });
}