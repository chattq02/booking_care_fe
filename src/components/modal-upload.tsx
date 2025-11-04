import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, message, Upload, Button, Space } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";

export interface ModalUploadRef {
  showModal: () => void;
  hideModal: () => void;
}

export interface ModalUploadProps {
  title?: string;
  handleDownloadTemplate?: () => void;
}

const { Dragger } = Upload;

const ModalUpload = forwardRef<ModalUploadRef, ModalUploadProps>(
  ({ handleDownloadTemplate, title }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const showModal = () => setIsModalOpen(true);
    const hideModal = () => {
      setIsModalOpen(false);
      setFileList([]); // 🔥 Clear Dragger khi đóng modal
    };

    // Expose methods ra ngoài thông qua ref
    useImperativeHandle(ref, () => ({
      showModal,
      hideModal,
    }));

    const props: UploadProps = {
      name: "file",
      multiple: false,
      action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
      onChange(info) {
        setFileList(info.fileList);
        const { status } = info.file;

        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      onDrop(e) {
        console.log("Dropped files", e.dataTransfer.files);
      },
      onRemove(file) {
        setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      },
    };

    return (
      <Modal
        title={title || "Tải tệp lên"}
        open={isModalOpen}
        onCancel={hideModal}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* 👈 Nút bên trái */}
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={handleDownloadTemplate}
            >
              Tải file mẫu
            </Button>

            {/* 👉 Nút bên phải (OK / Cancel) */}
            <Space>
              <Button onClick={hideModal}>Hủy</Button>
              <Button
                type="primary"
                onClick={() => {
                  message.success("Xử lý upload...");
                  hideModal();
                }}
                disabled={!fileList.length}
              >
                Xác nhận
              </Button>
            </Space>
          </div>
        }
        width={600}
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click hoặc kéo thả file vào đây để tải lên
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ upload một hoặc nhiều file. Không được tải dữ liệu nhạy cảm.
          </p>
        </Dragger>
      </Modal>
    );
  }
);

export default ModalUpload;
